import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';

import SideBar from './sideBar';
import style from './style.module.scss';

export default themr(identifiers.sideBar, style)(SideBar);
