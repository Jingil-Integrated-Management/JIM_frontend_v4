//drawer
import Drawer from '@mui/material/Drawer';

//icons
import CloseIcon from '@mui/icons-material/Close';

interface SettingProps {
  open: boolean;
  setOpen: Function;
}

const Setting = ({ open, setOpen }: SettingProps) => {
  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <div className="w-608 px-32 py-40">
        <div className="flex items-center justify-between">
          <span className="title-text">설정하기</span>
          <CloseIcon
            fontSize="small"
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default Setting;
