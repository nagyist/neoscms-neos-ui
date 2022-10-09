import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import style from './style.module.scss';
import ListPreviewElement from './listPreviewElement';

const ThemedListPreviewElement = themr(identifiers.listPreviewElement, style)(ListPreviewElement);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps';
import Icon from './../Icon';

export default injectProps({
    Icon
})(ThemedListPreviewElement);

