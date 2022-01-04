import { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Row from './rows/PartTableRow';
import useFetch from './InfiniteScroll';

import { PartData, ClientData } from '../../types';
import getClientName from '../../utils/getClientName';

import { TableEmpty } from './EmptyTable';
// import Filter from '../filter/Filter';

interface partTableProps {
  clientId: number;
  clientList: ClientData[];
}

const PartTable = (props: partTableProps) => {
  const [clientName, setClientName] = useState<string>('');
  const [pageNum, setPageNum] = useState<number>(1);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [mainDivision, setMainDivision] = useState<string>('');
  const [subDivision, setSubDivision] = useState<string>('');
  const [isOutSource, setIsOutSource] = useState<boolean | undefined>(
    undefined
  );
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const { list, hasMore, isLoading, setList } = useFetch({
    type: 'client',
    page: pageNum,
    client: props.clientId,
    category: 'part',
    main_division: mainDivision,
    sub_division: subDivision,
    is_outsource: isOutSource,
    startDate: startDate,
    endDate: endDate,
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
      if (entry.isIntersecting && hasMore) {
        setPageNum((page) => page + 1);
      }
    }, options);

    node && refCurrent.current.observe(node);
  };

  useEffect(() => {
    setPageNum(1);
    setOpenFilter(false);
    setMainDivision('');
    setSubDivision('');
    setDateRange([null, null]);
    setIsFiltered(false);
    setIsOutSource(undefined);
    setClientName(getClientName(props.clientList, props.clientId));
  }, [props.clientId]);

  useEffect(() => {
    setClientName(getClientName(props.clientList, props.clientId));
  }, []);

  return (
    <div
      id="part-table-container"
      className="table-container w-100p h-100p pb-35 overflow-hidden"
    >
      {/*openFilter && (
        <div className="filter absolute z-100">
          {openFilter && (
            <Filter
              client_id={props.client_id}
              setPageNum={setPageNum}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
              mainDivision={mainDivision}
              setMainDivision={setMainDivision}
              subDivision={subDivision}
              setSubDivision={setSubDivision}
              setList={setList}
              startDate={startDate} // for filter
              endDate={endDate} // for filter
              setDateRange={setDateRange} // for filter
              isOutSource={isOutSource}
              setIsOutSource={setIsOutSource}
              isFiltered={isFiltered}
              setIsFiltered={setIsFiltered}
            />
          )}
        </div>
      )*/}

      <TableContainer className="w-100p h-100p overflow-scroll scroll-hide">
        <div className="sticky top-0 bg-white">
          <div className="flex pb-10 items-center pr-24 justify-between">
            <div className="absoulte flex z-200 justify-center items-center h-44">
              <div className="client-name text-palette-black bg-palette-grey px-16 h-44 flex items-center flex-col justify-center">
                {clientName}
              </div>
              <button
                onClick={() => {
                  setOpenFilter(!openFilter);
                }}
                className={
                  'text-palette-word-2 bg-palette-grey ml-12 px-16 h-44 flex items-center font-medium flex-row justify-center ' +
                  (!isFiltered ? 'filter_button' : 'filter_button_on')
                }
              >
                필터 설정하기
              </button>
            </div>
          </div>
        </div>
        {list?.length === 0 ? (
          <div className="w-100p h-700">
            <TableEmpty category="파트" />
          </div>
        ) : (
          <>
            <Table aria-label="drawing table" className="w-100p bg-white">
              <TableHead>
                <TableRow>
                  <TableCell className="sticky top-54 w-208">구분</TableCell>
                  <TableCell className="sticky top-54 w-128">
                    세부 구분
                  </TableCell>
                  <TableCell className="sticky top-54 w-144">도면명</TableCell>
                  <TableCell className="sticky top-54 w-80">X</TableCell>
                  <TableCell className="sticky top-54 w-80">Y</TableCell>
                  <TableCell className="sticky top-54 w-80">Z</TableCell>
                  <TableCell className="sticky top-54 w-80">수량</TableCell>
                  <TableCell className="sticky top-54 price-cell w-112">
                    가격
                  </TableCell>
                  <TableCell className="sticky top-54 w-144">날짜</TableCell>
                  <TableCell className="sticky top-54 w-112">재질</TableCell>
                  <TableCell className="sticky top-54 w-112">종류</TableCell>
                  <TableCell className="sticky top-54 w-160">비고</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="cursor-pointer">
                {(list as PartData[])?.map((data) => (
                  <Row key={data.id} part={data} />
                ))}
              </TableBody>
            </Table>
            <div ref={observer} className="h-50"></div>
          </>
        )}
      </TableContainer>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  clientList: state.clientReducer.clientList,
});

export default connect(mapStateToProps)(PartTable);
