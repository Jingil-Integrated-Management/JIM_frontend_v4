import { useState } from 'react';

//table
import { TableCell, TableRow } from '@mui/material';

//types
import { PartData } from '../../../types';

//utils
import formatPrice from '../../../utils/formatPrice';

//drawer
import Drawer from '@mui/material/Drawer';
import Info from '../../drawers/info/Info';
import Patch from '../../drawers/patch/Patch';
// import AddDrawing from '../../drawers/addDrawing/AddDrawing';

interface partRowProps {
  part: PartData;
}
const Row = (props: partRowProps) => {
  const [revise, setRevise] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const closeDrawer = () => setOpen(false);
  return (
    <>
      <TableRow
        onClick={() => {
          setOpen(true);
        }}
      >
        <TableCell>{props.part.division__main_division}</TableCell>
        <TableCell>{props.part.division__sub_division}</TableCell>
        <TableCell>{props.part.drawing__name}</TableCell>
        <TableCell>{props.part.x}</TableCell>
        <TableCell>{props.part.y}</TableCell>
        <TableCell>{props.part.z}</TableCell>
        <TableCell>{props.part.quantity}</TableCell>
        <TableCell align="right">{formatPrice(props.part.price)}</TableCell>
        <TableCell>{props.part.created_at}</TableCell>
        <TableCell>{props.part.material}</TableCell>
        <TableCell>
          {props.part.drawing__is_outsource ? '제작' : '연마'}
        </TableCell>
        <TableCell>{props.part.comment ? props.part.comment : ''}</TableCell>
      </TableRow>
      <Drawer
        anchor="right"
        open={open}
        ModalProps={{ onBackdropClick: closeDrawer }}
        className="z-50"
      >
        {revise ? (
          <Patch
            target="part"
            setRevise={setRevise}
            parts={[props.part]}
            setOpen={setOpen}
          />
        ) : (
          <Info
            target="part"
            setRevise={setRevise}
            parts={[props.part]}
            setOpen={setOpen}
          />
        )}
      </Drawer>
    </>
  );
};

export default Row;
