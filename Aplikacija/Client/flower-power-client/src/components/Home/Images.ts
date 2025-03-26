interface Image {
  id: number;
  url: string;
  alt: string;
}
import img1 from '../../images/photo1.jpg';
import img2 from '../../images/photo2.jpg';
import img3 from '../../images/photo3.jpg';
import img4 from '../../images/photo4.jpg';
import img5 from '../../images/photo5.jpg';

export const Images: Image[] = [
  {
    id: 1,
    url: img1,
    alt: 'Image 1',
  },
  {
    id: 2,
    url: img2,
    alt: 'Image 2',
  },
  {
    id: 3,
    url: img3,
    alt: 'Image 3',
  },
  {
    id: 4,
    url: img4,
    alt: 'Image 4',
  },
  {
    id: 5,
    url: img5,
    alt: 'Image 5',
  },
];
