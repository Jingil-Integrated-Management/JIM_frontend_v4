import { useState } from 'react';

//types
import { DrawingData, ClientData } from '../../../types';

//utils
import getClientID from '../../../utils/getClientID';
import dateConverter from '../../../utils/dateConverter';
import formatDate from '../../../utils/formatDate';

//date-picker
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/esm/locale';

interface PatchDrawingProps {
  drawing: DrawingData;
  clientList: ClientData[];
  targetDrawing: DrawingData | null;
  setTargetDrawing: Function;
}

const PatchDrawing = (props: PatchDrawingProps) => {
  const [clientName, setClientName] = useState<string>(
    props.drawing.client__name ? props.drawing.client__name : ''
  );
  const [date, setDate] = useState<Date>(
    dateConverter(props.drawing.created_at)
  );

  return (
    <div className="w-full h-220">
      <div className="flex mt-53">
        <div className="flex justify-center items-center w-95 h-40 rounded-panel bg-palette-grey">
          도면 정보
        </div>
        {props.drawing.is_outsource ? (
          <div className="flex justify-center items-center w-62 h-40 ml-10 rounded-panel onOsBox">
            제작
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="mt-24 h-72 flex">
        <div className="w-256">
          <div className="w-full text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            도면명
          </div>
          <input
            className="w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            value={props.targetDrawing?.name || ''}
            onChange={(e) =>
              props.setTargetDrawing({
                ...props.targetDrawing,
                name: e.target.value,
              })
            }
          />
        </div>
        <div className="w-256 ml-32">
          <div className="w-full text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            담당회사
          </div>
          <input
            className="w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            list="patch-drawing-client-list"
            value={clientName}
            onChange={(e) => {
              setClientName(e.target.value);
              props.setTargetDrawing({
                ...props.targetDrawing,
                client: getClientID(props.clientList, e.target.value),
              });
            }}
          />
          <datalist id="patch-drawing-client-list">
            {props.clientList.map((client: ClientData, index: number) => {
              return <option key={index} value={client.name} />;
            })}
          </datalist>
        </div>
      </div>
      <div className="mt-12 h-72 flex">
        <div className="w-256">
          <div className="w-full text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            날짜
          </div>
          <DatePicker
            selected={date}
            locale={ko}
            onChange={(changedDate: Date) => {
              setDate(changedDate);
              props.setTargetDrawing({
                ...props.targetDrawing,
                created_at: formatDate(changedDate),
              });
            }}
            className="w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input"
          />
        </div>
        <div className="w-256 ml-32">
          <div className="w-full text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            비고
          </div>
          <input
            className="w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            value={props.targetDrawing?.comment || ''}
            onChange={(e) =>
              props.setTargetDrawing({
                ...props.targetDrawing,
                comment: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PatchDrawing;
