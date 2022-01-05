import { AxiosResponse } from 'axios';
import { DrawingData, OutsourceData, PartData } from '../types';
import validatePost from './validatePost';
import webClient from './Webclient';

const postDrawing = async (
  drawing: DrawingData,
  parts: PartData[],
  osParts: OutsourceData[]
) => {
  try {
    if (!validatePost(drawing, parts)) return;

    const createdDrawing: AxiosResponse = await webClient.post(
      'drawing/',
      drawing
    );

    // Step 1. Create Drawing
    const drawingId = createdDrawing.data.id;

    for (let i = 0; i < parts.length; i++) {
      const part = { ...parts[i] };
      part.drawing = drawingId;

      // Step 2. Upload Image if necessary
      if (part.fileData) {
        const formData = new FormData();
        formData.append('file', part.fileData);
        const createdFile: AxiosResponse = await webClient.post(
          'files/',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        const fileId = createdFile.data.id;
        part.file = fileId;
      }

      // Step 3. Create Outsource if necessary
      if (drawing.is_outsource) {
        const createdOsPart: AxiosResponse = await webClient.post(
          'outsource/',
          osParts[i]
        );
        part.outsource = createdOsPart.data.id;
      }

      // Step 4. Create Drawing
      await webClient.post('part/', {
        x: part.x,
        y: part.y,
        z: part.z,
        quantity: part.quantity,
        price: part.price,
        comment: part.comment,
        drawing: part.drawing,
        division: part.division,
        material: part.material,
        outsource: part.outsource,
        file: part.file,
      });
    }

    alert('도면을 성공적으로 추가하였습니다.');
    window.location.replace('/');
  } catch (error) {
    console.log(error);
  }
};

export default postDrawing;
