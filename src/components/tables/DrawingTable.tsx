import { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import Row from './rows/DrawingTableRow';
import useFetch from './InfiniteScroll';

import { ClientData, DrawingData } from '../../types';
import getClientName from '../../utils/getClientName';

interface drawingTableProps {
  clientId: number;
  clientList: ClientData[];
  type: string;
  month?: string;
}

const DrawingTable = (props: drawingTableProps) => {
  const [selectedCollapse, setSelectedCollapse] = useState<null | number>(null);
  const [pageNum, setPageNum] = useState<number>(1);
  const [clientName, setClientName] = useState<string>('');
  const { list, hasMore, isLoading, setList } = useFetch({
    type: props.type,
    page: pageNum,
    client: props.clientId,
    category: 'drawing',
    month: props.month,
  });

  const observerRef = useRef();
  const options = {
    root: document.querySelector('#drawing-table-container'),
    rootMargin: '0px',
    threshold: 0.9,
  };

  const observer = (node: any) => {
    const refCurrent = observerRef as React.MutableRefObject<any>;

    if (isLoading) return;
    if (refCurrent.current) refCurrent.current.disconnect();

    refCurrent.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && props.type === 'client') {
        setPageNum((page) => page + 1);
      }
    }, options);

    node && refCurrent.current.observe(node);
  };

  const selectCurrentCollapse = (index: number) => {
    selectedCollapse === index
      ? setSelectedCollapse(null)
      : setSelectedCollapse(index);
  };

  useEffect(() => {
    setList([]);
    setClientName(getClientName(props.clientList, props.clientId));
  }, [props.month, props.clientId]);

  useEffect(() => {
    setClientName(getClientName(props.clientList, props.clientId));
  }, []);

  return (
    <div
      key={props.clientId}
      className={
        'w-100p' + (props.type === 'client' ? ' h-100p overflow-hidden' : ' ')
      }
    >
      <TableContainer
        className={
          'w-100p' +
          (props.type === 'client'
            ? ' overflow-scroll scroll-hide h-100p'
            : ' h-auto')
        }
      >
        <div className="sticky top-0 bg-white">
          <div className="flex items-center pb-12 justify-between">
            <div className="flex justify-center items-center">
              <div className="client-name text-palette-black bg-palette-grey px-16 h-44 flex items-center">
                {clientName}
              </div>
            </div>
          </div>
        </div>
        {list?.length === 0 && props.type !== 'dashboard' ? (
          <div className="w-100p ">
            {/* TODO
            (props.type === 'statistics_pol' || props.type === 'statistics_os'
                ? 'h-280'
                : 'h-700') 
            */}
            {/* TODO<TableEmpty category={'도면'} />*/}
          </div>
        ) : (
          <>
            <Table aria-label="drawing table" className="w-100p">
              <TableHead className="sticky top-52 bg-white">
                <TableRow>
                  <TableCell className="w-288">도면명</TableCell>
                  <TableCell className="w-160">파트 개수</TableCell>
                  <TableCell className="w-192 price-cell">가격</TableCell>
                  <TableCell className="w-256">날짜</TableCell>
                  <TableCell className="w-160">종류</TableCell>
                  <TableCell className="w-288">비고</TableCell>
                  <TableCell className="w-96" />
                </TableRow>
              </TableHead>
              <TableBody className="cursor-pointer h-100p">
                {(list as DrawingData[]).map((data, index) => (
                  <Row
                    key={index}
                    drawing={data}
                    selectedCollapse={selectedCollapse}
                    selectCurrentCollapse={selectCurrentCollapse}
                  />
                ))}
              </TableBody>
            </Table>
            {props.type === 'client' ? (
              <div ref={observer} className="h-50"></div>
            ) : (
              <></>
            )}
          </>
        )}
      </TableContainer>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  clientList: state.clientReducer.clientList,
});

export default connect(mapStateToProps)(DrawingTable);
