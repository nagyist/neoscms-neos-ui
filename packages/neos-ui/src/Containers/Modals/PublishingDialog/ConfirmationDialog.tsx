/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import React from 'react';

import {Button, Dialog, Icon} from '@neos-project/react-ui-components';
import I18n from '@neos-project/neos-ui-i18n';
import {PublishingMode, PublishingPhase, PublishingScope} from '@neos-project/neos-ui-redux-store/src/CR/Publishing';

import {Diagram} from './Diagram';

import style from './style.module.css';

const ConfirmationDialogVariants = {
    [PublishingMode.PUBLISH]: {
        id: 'neos-PublishDialog',
        style: 'success',
        icon: {
            title: 'share-square-o',
            confirm: 'share-square-o'
        },
        [PublishingScope.ALL]: {
            label: {
                title: {
                    id: 'Neos.Neos.Ui:PublishingDialog:publish.all.confirmation.title',
                    fallback: (props: { scopeTitle: string; }) =>
                        `Publish all changes in workspace "${props.scopeTitle}"`
                },
                message: {
                    id: 'Neos.Neos.Ui:PublishingDialog:publish.all.confirmation.message',
                    fallback: (props: { numberOfChanges: number; scopeTitle: string; targetWorkspaceName: null | string; }) =>
                        `Are you sure that you want to publish all ${props.numberOfChanges} change(s) in workspace "${props.scopeTitle}" to workspace "${props.targetWorkspaceName}"? Be careful: This cannot be undone!`
                },
                cancel: {
                    id: 'Neos.Neos.Ui:PublishingDialog:publish.all.confirmation.cancel',
                    fallback: 'No, cancel'
                },
                confirm: {
                    id: 'Neos.Neos.Ui:PublishingDialog:publish.all.confirmation.confirm',
                    fallback: 'Yes, publish'
                }
            }
        },
        [PublishingScope.SITE]: {
            label: {
                title: {
                    id: 'Neos.Neos.Ui:PublishingDialog:publish.site.confirmation.title',
                    fallback: (props: { scopeTitle: string; }) =>
                        `Publish all changes in site "${props.scopeTitle}"`
                },
                message: {
                    id: 'Neos.Neos.Ui:PublishingDialog:publish.site.confirmation.message',
                    fallback: (props: { numberOfChanges: number; scopeTitle: string; sourceWorkspaceName: string; targetWorkspaceName: null | string; }) =>
                        `Are you sure that you want to publish all ${props.numberOfChanges} change(s) in site "${props.scopeTitle}" from workspace "${props.sourceWorkspaceName}" to workspace "${props.targetWorkspaceName}"? Be careful: This cannot be undone!`
                },
                cancel: {
                    id: 'Neos.Neos.Ui:PublishingDialog:publish.site.confirmation.cancel',
                    fallback: 'No, cancel'
                },
                confirm: {
                    id: 'Neos.Neos.Ui:PublishingDialog:publish.site.confirmation.confirm',
                    fallback: 'Yes, publish'
                }
            }
        },
        // NOTE that with https://github.com/neos/neos-ui/pull/3909 this variant is currently effectively not used as confirmation is not required
        [PublishingScope.DOCUMENT]: {
            label: {
                title: {
                    id: 'Neos.Neos.Ui:PublishingDialog:publish.document.confirmation.title',
                    fallback: (props: { scopeTitle: string; }) =>
                        `Publish all changes in document "${props.scopeTitle}"`
                },
                message: {
                    id: 'Neos.Neos.Ui:PublishingDialog:publish.document.confirmation.message',
                    fallback: (props: { numberOfChanges: number; scopeTitle: string; sourceWorkspaceName: string; targetWorkspaceName: null | string; }) =>
                        `Are you sure that you want to publish all ${props.numberOfChanges} change(s) in document "${props.scopeTitle}" from workspace "${props.sourceWorkspaceName}" to workspace "${props.targetWorkspaceName}"? Be careful: This cannot be undone!`
                },
                cancel: {
                    id: 'Neos.Neos.Ui:PublishingDialog:publish.document.confirmation.cancel',
                    fallback: 'No, cancel'
                },
                confirm: {
                    id: 'Neos.Neos.Ui:PublishingDialog:publish.document.confirmation.confirm',
                    fallback: 'Yes, publish'
                }
            }
        }
    },
    [PublishingMode.DISCARD]: {
        id: 'neos-DiscardDialog',
        style: 'error',
        icon: {
            title: 'exclamation-triangle',
            confirm: 'ban'
        },
        [PublishingScope.ALL]: {
            label: {
                title: {
                    id: 'Neos.Neos.Ui:PublishingDialog:discard.all.confirmation.title',
                    fallback: (props: { scopeTitle: string; }) =>
                        `Discard all changes in workspace "${props.scopeTitle}"`
                },
                message: {
                    id: 'Neos.Neos.Ui:PublishingDialog:discard.all.confirmation.message',
                    fallback: (props: { numberOfChanges: number; scopeTitle: string; }) =>
                        `Are you sure that you want to discard all ${props.numberOfChanges} change(s) in workspace "${props.scopeTitle}"? Be careful: This cannot be undone!`
                },
                cancel: {
                    id: 'Neos.Neos.Ui:PublishingDialog:discard.all.confirmation.cancel',
                    fallback: 'No, cancel'
                },
                confirm: {
                    id: 'Neos.Neos.Ui:PublishingDialog:discard.all.confirmation.confirm',
                    fallback: 'Yes, discard'
                }
            }
        },
        [PublishingScope.SITE]: {
            label: {
                title: {
                    id: 'Neos.Neos.Ui:PublishingDialog:discard.site.confirmation.title',
                    fallback: (props: { scopeTitle: string; }) =>
                        `Discard all changes in site "${props.scopeTitle}"`
                },
                message: {
                    id: 'Neos.Neos.Ui:PublishingDialog:discard.site.confirmation.message',
                    fallback: (props: { numberOfChanges: number; scopeTitle: string; sourceWorkspaceName: string; }) =>
                        `Are you sure that you want to discard all ${props.numberOfChanges} change(s) in site "${props.scopeTitle}" from workspace "${props.sourceWorkspaceName}"? Be careful: This cannot be undone!`
                },
                cancel: {
                    id: 'Neos.Neos.Ui:PublishingDialog:discard.site.confirmation.cancel',
                    fallback: 'No, cancel'
                },
                confirm: {
                    id: 'Neos.Neos.Ui:PublishingDialog:discard.site.confirmation.confirm',
                    fallback: 'Yes, discard'
                }
            }
        },
        [PublishingScope.DOCUMENT]: {
            label: {
                title: {
                    id: 'Neos.Neos.Ui:PublishingDialog:discard.document.confirmation.title',
                    fallback: (props: { scopeTitle: string; }) =>
                        `Discard all changes in document "${props.scopeTitle}"`
                },
                message: {
                    id: 'Neos.Neos.Ui:PublishingDialog:discard.document.confirmation.message',
                    fallback: (props: { numberOfChanges: number; scopeTitle: string; sourceWorkspaceName: string; }) =>
                        `Are you sure that you want to discard all ${props.numberOfChanges} change(s) in document "${props.scopeTitle}" from workspace "${props.sourceWorkspaceName}"? Be careful: This cannot be undone!`
                },
                cancel: {
                    id: 'Neos.Neos.Ui:PublishingDialog:discard.document.confirmation.cancel',
                    fallback: 'No, cancel'
                },
                confirm: {
                    id: 'Neos.Neos.Ui:PublishingDialog:discard.document.confirmation.confirm',
                    fallback: 'Yes, discard'
                }
            }
        }
    }
} as const;

type ConfirmationDialogProps = {
    mode: PublishingMode;
    scope: PublishingScope;
    scopeTitle: string;
    sourceWorkspaceName: string;
    targetWorkspaceName: null | string;
    numberOfChanges: number;
    onAbort: () => void;
    onConfirm: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = (props) => {
    const variant = ConfirmationDialogVariants[props.mode];

    return (
        <Dialog
            actions={[
                <Button
                    id={`${variant.id}-Cancel`}
                    key="cancel"
                    style="lighter"
                    hoverStyle="brand"
                    onClick={props.onAbort}
                >
                    <I18n {...variant[props.scope].label.cancel} />
                </Button>,
                <Button
                    id={`${variant.id}-Confirm`}
                    key="confirm"
                    style={variant.style}
                    hoverStyle={variant.style}
                    onClick={props.onConfirm}
                >
                    <Icon icon={variant.icon.confirm} className={style.buttonIcon} />
                    <I18n {...variant[props.scope].label.confirm} />
                </Button>
            ]}
            title={<div>
                <Icon icon={variant.icon.title} />
                <span className={style.modalTitle}>
                    <I18n
                        id={variant[props.scope].label.title.id}
                        params={props}
                        fallback={variant[props.scope].label.title.fallback(props)}
                        />
                </span>
            </div>}
            onRequestClose={props.onAbort}
            type={variant.style}
            isOpen
            autoFocus
            theme={undefined as any}
            style={undefined as any}
        >
            <div className={style.modalContents}>
                <Diagram
                    phase={PublishingPhase.START}
                    sourceWorkspaceName={props.sourceWorkspaceName}
                    targetWorkspaceName={props.targetWorkspaceName}
                    numberOfChanges={props.numberOfChanges}
                    />
                <I18n
                    id={variant[props.scope].label.message.id}
                    params={props}
                    fallback={variant[props.scope].label.message.fallback(props)}
                    />
            </div>
        </Dialog>
    );
};
