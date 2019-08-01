import moment from 'moment';
import { Products, Categories } from '../../../lib/collections';


export default function addDefaultProducts() {
  const category = {
    categoryName: 'Sneaker',
    code: 'SN',
    createdAt: moment().toDate(),
    createdBy: 'default',
    modifiedBy: 'default',
    modifiedAt: moment().toDate(),
    isDelete: false
  };

  const categoryId = Categories.insert(category);

  const products = [
    {
      bgUrl: 'url(/assets/img/1.png)',
      rawBgUrl: 'http://www.richkid.club/assets/img/1.png',
      title: 'Air Force 1 Earth Day Collection',
      availables: [
        {
          size: 8,
          price: 430,
          quantity: 10
        },
        {
          size: 8.5,
          price: 430,
          quantity: 2
        }
      ],
      code: 'SN001',
      description: 'In collaboration with LA-based designer and artist Steven Harrington who is known for his optimistic and captivating style, this special-edition Air Force 1 is centered around one theme—sustainability. To align with the nature-friendly ethos, each silhouette features Flyleather innovation that’s made with at least 50% leather fiber however still looks and feels like regular leather. The graphics are bold, fun and impossible to miss and the collection hopes to inspire people to care for our planet each and every day.',
      categoryId,
      images: [],
      isFeature: true,
      isPublish: true,
      isDelete: false,
      createdAt: moment().toDate(),
      createdBy: 'default',
      modifiedBy: 'default',
      modifiedAt: moment().toDate(),
    },
    {
      bgUrl: 'url(/assets/img/2.png)',
      rawBgUrl: 'http://www.richkid.club/assets/img/2.png',
      title: 'Blazer Earth Day Collection',
      availables: [
        {
          size: 8.5,
          price: 370,
          quantity: 20
        },
      ],
      code: 'SN002',
      description: 'In collaboration with LA-based designer and artist Steven Harrington who is known for his optimistic and captivating style, this special-edition Blazer Low is centered around one theme—sustainability. To align with the nature-friendly ethos, each silhouette features Flyleather innovation that’s made with at least 50% leather fiber however still looks and feels like regular leather. The graphics are bold, fun and impossible to miss and the collection hopes to inspire people to care for our planet each and every day.',
      categoryId,
      images: [],
      isFeature: true,
      isPublish: true,
      isDelete: false,
      createdAt: moment().toDate(),
      createdBy: 'default',
      modifiedBy: 'default',
      modifiedAt: moment().toDate(),
    },
    {
      bgUrl: 'url(/assets/img/3.png)',
      rawBgUrl: 'http://www.richkid.club/assets/img/3.png',
      title: 'Cortez Earth Day Collection',
      availables: [
        {
          size: 8.5,
          price: 400,
          quantity: 12
        },
      ],
      code: 'SN003',
      description: 'In collaboration with LA-based designer and artist Steven Harrington who is known for his optimistic and captivating style, this special-edition Cortez is centered around one theme—sustainability. To align with the nature-friendly ethos, each silhouette features Flyleather innovation that’s made with at least 50% leather fiber however still looks and feels like regular leather. The graphics are bold, fun and impossible to miss and the collection hopes to inspire people to care for our planet each and every day.',
      categoryId,
      images: [],
      isFeature: true,
      isPublish: true,
      isDelete: false,
      createdAt: moment().toDate(),
      createdBy: 'default',
      modifiedBy: 'default',
      modifiedAt: moment().toDate(),
    }
  ];

  products.forEach((product) => {
    Products.insert(product);
  });
}
