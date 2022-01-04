//drawer
import Drawer from '@mui/material/Drawer';

//icons
import CloseIcon from '@mui/icons-material/Close';

//types
import { ClientData } from '../../types';

//components
import ClientSetting from './ClientSetting';
import NavigationSetting from './NavigationSetting';
import DivisionSetting from './DivisionSetting';

//redux
import { connect } from 'react-redux';

interface SettingProps {
  open: boolean;
  setOpen: Function;
  clientList: ClientData[];
}

const Setting = ({ open, setOpen, clientList }: SettingProps) => {
  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <div className="w-608 px-32 py-40">
        <div className="flex items-center justify-between">
          <span className="setting-title-text">설정하기</span>
          <CloseIcon
            fontSize="small"
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>
        <ClientSetting clientList={clientList} />
        <NavigationSetting clientList={clientList} />
        <DivisionSetting clientList={clientList} />
      </div>
    </Drawer>
  );
};

const mapStateToProps = (state: any) => ({
  clientList: state.clientReducer.clientList,
});

export default connect(mapStateToProps)(Setting);
