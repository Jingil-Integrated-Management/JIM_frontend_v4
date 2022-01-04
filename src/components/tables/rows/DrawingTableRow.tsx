import { useState } from 'react';

import { Box } from '@mui/system';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Collapse,
} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { PartData, DrawingData } from '../../../types';

import webClient from '../../../utils/Webclient';
import { AxiosResponse } from 'axios';

import formatPrice from '../../../utils/formatPrice';

import Drawer from '@mui/material/Drawer';

export interface drawingRowProps {
  drawing: DrawingData;
  selectedCollapse: number | null;
  selectCurrentCollapse: Function;
}

const Row = (props: drawingRowProps) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [parts, setParts] = useState([] as PartData[]);
  const [revise, setRevise] = useState<boolean>(false);
  const [isFocusArrow, setIsFocusArrow] = useState(false);
  const [open, setOpen] = useState<boolean>(false);

  const getParts = async () => {
    if (!isOpened) {
      try {
        const response: AxiosResponse = await webClient.get(
          'part/?drawing=' + props.drawing.id
        );
        setParts(response.data.results as PartData[]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const openDrawer = (event: any) => {
    if (event.target.classList[0] === 'MuiTableCell-root') {
      setOpen(true);
      getParts();
      setIsOpened(true);
    } else {
      setOpen(false);
    }
  };
  const closeDrawer = () => setOpen(false);

  return (
    <>
      <TableRow
        className={
          'h-48 ' +
          (props.selectedCollapse === props.drawing.id
            ? 'collapse-open collapse-row-opened'
            : '') +
          (isFocusArrow && props.selectedCollapse !== props.drawing.id
            ? ' arrow-focus'
            : '')
        }
        onClick={(event) => openDrawer(event)}
      >
        <TableCell>{props.drawing.name}</TableCell>
        <TableCell>{props.drawing.part_count}</TableCell>
        <TableCell align="right">{formatPrice(props.drawing.price)}</TableCell>
        <TableCell>{props.drawing.created_at}</TableCell>
        <TableCell>{props.drawing.is_outsource ? '제작' : '연마'}</TableCell>
        <TableCell>
          {!props.drawing.comment ? '' : props.drawing.comment}
        </TableCell>
        <TableCell>
          <div
            onClick={() => {
              props.selectCurrentCollapse(props.drawing.id);
              getParts();
              setIsOpened(true);
            }}
            className="flex items-center justify-center w-30 h-30 arrowIcon cursor-pointer collapse-arrow"
            onMouseEnter={() => {
              setIsFocusArrow(true);
            }}
            onMouseLeave={() => {
              setIsFocusArrow(false);
            }}
          >
            {props.selectedCollapse === props.drawing.id ? (
              <KeyboardArrowUpIcon fontSize="small" />
            ) : (
              <KeyboardArrowDownIcon fontSize="small" />
            )}
          </div>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0, padding: 0 }}
          colSpan={7}
        >
          <Collapse
            in={props.selectedCollapse === props.drawing.id}
            timeout="auto"
            unmountOnExit
          >
            <Box
              className={
                'pb-6 pt-6 cursor-default collapse-open collapse-table-open pl-20 pr-20' +
                (props.selectedCollapse !== props.drawing.id
                  ? ' collapse-table-close'
                  : '')
              }
            >
              <Table>
                <TableHead>
                  <TableRow className="part-table-header">
                    <TableCell>구분</TableCell>
                    <TableCell>세부 구분</TableCell>
                    <TableCell>도면명</TableCell>
                    <TableCell>X</TableCell>
                    <TableCell>Y</TableCell>
                    <TableCell>Z</TableCell>
                    <TableCell>수량</TableCell>
                    <TableCell className="price-cell">가격</TableCell>
                    <TableCell>날짜</TableCell>
                    <TableCell>재질</TableCell>
                    <TableCell>종류</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parts.map((part: PartData) => (
                    <TableRow key={part.id}>
                      <TableCell>{part.division__main_division}</TableCell>
                      <TableCell>{part.division__sub_division}</TableCell>
                      <TableCell>{part.drawing__name}</TableCell>
                      <TableCell>{part.x}</TableCell>
                      <TableCell>{part.y}</TableCell>
                      <TableCell>{part.z}</TableCell>
                      <TableCell>{part.quantity}</TableCell>
                      <TableCell align="right">
                        {formatPrice(part.price)}
                      </TableCell>
                      <TableCell>{part.created_at}</TableCell>
                      <TableCell>{part.material}</TableCell>
                      <TableCell>
                        {part.drawing__is_outsource ? '제작' : '연마'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Drawer
        anchor="right"
        open={open}
        ModalProps={{ onBackdropClick: closeDrawer }}
        className="z-50"
      >
        {/*revise ? (
          <AddDrawing
            drawing={props.drawing}
            mode="revise_drawing"
            setRevise={setRevise}
            parts={parts}
          />
        ) : (
          <Info
            target="drawing"
            setRevise={setRevise}
            parts={parts}
            drawing={props.drawing}
            setOpen={setOpen}
          />
        )*/}
      </Drawer>
    </>
  );
};

export default Row;
