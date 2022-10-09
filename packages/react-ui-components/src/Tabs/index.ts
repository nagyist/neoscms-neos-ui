import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import style from './style.module.scss';
import Tabs from './tabs';

export default themr(identifiers.tabs, style)(Tabs);
