import {takeLatest, take, put, race, call, select} from 'redux-saga/effects';

import {actions, actionTypes, selectors} from '@neos-project/neos-ui-redux-store';

import {applySaveHooksForTransientValuesMap} from '../../Changes/saveHooks';

import {calculateChangeTypeFromMode, calculateDomAddressesFromMode} from './helpers';

const STEP_SELECT_NODETYPE = Symbol('STEP_SELECT_NODETYPE');
const STEP_NODE_CREATION_DIALOG = Symbol('STEP_NODE_CREATION_DIALOG');
const STEP_FINISH = Symbol('STEP_FINISH');

function * nodeCreationWorkflow(context, step = STEP_SELECT_NODETYPE, workflowData = {}) {
    const {
        nodeTypesRegistry,
        saveHooksRegistry,
        referenceNodeContextPath,
        referenceNodeFusionPath,
        preferredMode,
        nodeType
    } = context;
    switch (step) {
        //
        // Start with showing a dialog for node type selection
        //
        case STEP_SELECT_NODETYPE: {
            yield put(actions.UI.SelectNodeTypeModal.open(referenceNodeContextPath, preferredMode));

            // If nodeType option is passed, skip selection of nodetype and immediately jump to the next step
            if (nodeType) {
                yield put(actions.UI.SelectNodeTypeModal.apply(preferredMode, nodeType));
                return yield call(nodeCreationWorkflow, context, STEP_NODE_CREATION_DIALOG, {preferredMode, nodeType});
            }
            const waitForNextAction = yield race([
                take(actionTypes.UI.SelectNodeTypeModal.CANCEL),
                take(actionTypes.UI.SelectNodeTypeModal.APPLY)
            ]);
            const nextAction = Object.values(waitForNextAction)[0];
            //
            // User closed the modal, do nothing...
            //
            if (nextAction.type === actionTypes.UI.SelectNodeTypeModal.CANCEL) {
                return;
            }
            //
            // User selected a node type, move on
            //
            if (nextAction.type === actionTypes.UI.SelectNodeTypeModal.APPLY) {
                const {mode, nodeType} = nextAction.payload;
                return yield call(nodeCreationWorkflow, context, STEP_NODE_CREATION_DIALOG, {mode, nodeType});
            }
            break;
        }
        case STEP_NODE_CREATION_DIALOG: {
            const nodeType = nodeTypesRegistry.get(workflowData.nodeType);
            const referenceNodeSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(referenceNodeContextPath);
            const referencedNode = yield select(referenceNodeSelector);

            const parentNodeContextPath = workflowData.mode === 'into' ?
                referenceNodeContextPath :
                referencedNode.parent;

            const label = nodeType?.label;
            const configuration = nodeType?.ui?.creationDialog;
            if (configuration) {
                //
                // This node type has a creationDialog configuration,
                // therefore we show the creation dialog
                //
                yield put(actions.UI.NodeCreationDialog.open(label, configuration, parentNodeContextPath, workflowData.nodeType));
                const waitForNextAction = yield race([
                    take(actionTypes.UI.NodeCreationDialog.CANCEL),
                    take(actionTypes.UI.NodeCreationDialog.BACK),
                    take(actionTypes.UI.NodeCreationDialog.APPLY)
                ]);
                const nextAction = Object.values(waitForNextAction)[0];
                //
                // User closed the creation dialog, do nothing...
                //
                if (nextAction.type === actionTypes.UI.NodeCreationDialog.CANCEL) {
                    return;
                }
                //
                // User asked to go back
                //
                if (nextAction.type === actionTypes.UI.NodeCreationDialog.BACK) {
                    return yield call(nodeCreationWorkflow, context, STEP_SELECT_NODETYPE);
                }
                if (nextAction.type === actionTypes.UI.NodeCreationDialog.APPLY) {
                    return yield call(nodeCreationWorkflow, context, STEP_FINISH, {
                        ...workflowData,
                        transientValues: nextAction.payload
                    });
                }
            }
            return yield call(nodeCreationWorkflow, context, STEP_FINISH, workflowData);
        }
        case STEP_FINISH: {
            const {mode, nodeType, transientValues} = workflowData;
            if (nodeTypesRegistry.hasRole(nodeType, 'document')) {
                yield put(actions.UI.ContentCanvas.startLoading());
            }

            const referenceNodeSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(referenceNodeContextPath);
            const referenceNode = yield select(referenceNodeSelector);
            const baseNodeType = yield select(
                state => state?.ui?.pageTree?.filterNodeType
            );
            const data = yield * applySaveHooksForTransientValuesMap(transientValues, saveHooksRegistry);

            return yield put(actions.Changes.persistChanges([{
                type: calculateChangeTypeFromMode(mode, 'Create'),
                subject: referenceNodeContextPath,
                payload: {
                    ...calculateDomAddressesFromMode(mode, referenceNode, referenceNodeFusionPath),
                    nodeType,
                    data,
                    baseNodeType
                }
            }]));
        }
        default: return null;
    }
}
export default function * addNode({globalRegistry}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    const saveHooksRegistry = globalRegistry.get('inspector').get('saveHooks');

    yield takeLatest(actionTypes.CR.Nodes.COMMENCE_CREATION, function * (action) {
        const {referenceNodeContextPath, referenceNodeFusionPath, preferredMode, nodeType} = action.payload;
        const context = {
            nodeTypesRegistry,
            saveHooksRegistry,
            referenceNodeContextPath,
            referenceNodeFusionPath,
            preferredMode,
            nodeType
        };
        yield call(nodeCreationWorkflow, context);
    });
}
// We expose nodeCreationWorkflow in case somebody would need to override `addNode` saga
// but would still need access to original workflow
addNode.nodeCreationWorkflow = nodeCreationWorkflow;
