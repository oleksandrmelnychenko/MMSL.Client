import { createAction } from '@reduxjs/toolkit';
import * as productSettingsTypes from '../../constants/productSettings.types.constants';
import { ManagingPanelComponent } from '../reducers/productSettings.reducer';

export const managingPanelContent = createAction<ManagingPanelComponent | null>(
  productSettingsTypes.MANAGING_PANEL_CONTENT
);

export type ManagingPanelContent = ReturnType<typeof managingPanelContent>;
