//types
import { DrawingData } from '../../../types';

interface drawingInfoProps {
  drawing: DrawingData;
}

const DrawingInfo = (props: drawingInfoProps) => {
  return (
    <div className="w-full h-220">
      <div className="flex mt-53">
        <div className="flex justify-center items-center w-40 h-40 bg-palette-purple-index rounded-panel">
          0
        </div>
        <div className="flex justify-center items-center w-95 h-40 ml-10 rounded-panel bg-palette-grey">
          도면 정보
        </div>
        {props.drawing.is_outsource ? (
          <div className="flex justify-center items-center w-62 h-40 ml-10 rounded-panel onOsBox">
            외주
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="mt-24 h-72 flex">
        <div className="w-256">
          <div className="w-full text-14 font-medium leading-1.14 text-palette-grey-menuicons">
            도면명
          </div>
          <div className="w-full h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center">
            {props.drawing.name}
          </div>
        </div>
        <div className="w-256 ml-32">
          <div className="w-full text-14 font-medium leading-1.14 text-palette-grey-menuicons">
            담당회사
          </div>
          <div className="w-full h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center">
            {props.drawing.client__name}
          </div>
        </div>
      </div>
      <div className="mt-12 h-72 flex">
        <div className="w-256">
          <div className="w-full text-14 font-medium leading-1.14 text-palette-grey-menuicons">
            날짜
          </div>
          <div className="w-full h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center">
            {props.drawing.created_at}
          </div>
        </div>
        <div className="w-256 ml-32">
          <div className="w-full text-14 font-medium leading-1.14 text-palette-grey-menuicons">
            비고
          </div>
          <div className="w-full h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center">
            {props.drawing.comment}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawingInfo;
