import { DefaultParams } from 'src/app/utils/defaultParams';

export interface SidenavItemProps extends DefaultParams {
  text: string;
  href?: string;
  iconPath: string;
  onClick?: () => any;
}
