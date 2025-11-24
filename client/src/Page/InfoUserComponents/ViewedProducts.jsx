import { Card, Empty, Button, Rate } from 'antd';
import { useEffect, useState } from 'react';

import { requestGetViewProduct } from '../../config/request';

import CardBody from '../../Components/CardBody/CardBody';

const ViewedProducts = () => {
    const [viewedProducts, setViewedProducts] = useState([]);

    useEffect(() => {
        const fetchViewProduct = async () => {
            const res = await requestGetViewProduct();
            setViewedProducts(res.metadata);
        };
        fetchViewProduct();
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Sản phẩm đã xem</h2>

            {viewedProducts.length === 0 ? (
                <div className="text-center py-10">
                    <Empty description="Bạn chưa xem sản phẩm nào" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {viewedProducts.map((product) => (
                        <CardBody product={product.product} />
                        // <div
                        //     key={product._id}
                        //     className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        // >
                        //     <Card
                        //         cover={
                        //             <div className="h-48 overflow-hidden">
                        //                 <img
                        //                     alt={product.product.nameProduct}
                        //                     src={product.product.images[0]}
                        //                     className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        //                 />
                        //             </div>
                        //         }
                        //         actions={[
                        //             <Button
                        //                 key="add-to-cart"
                        //                 type="primary"
                        //                 icon={<ShoppingCartOutlined />}
                        //                 className="bg-blue-500 hover:bg-blue-600"
                        //             >
                        //                 Thêm vào giỏ
                        //             </Button>,
                        //             <Button key="favorite" icon={<HeartOutlined />}>
                        //                 Yêu thích
                        //             </Button>,
                        //         ]}
                        //         className="h-full flex flex-col"
                        //     >
                        //         <Meta
                        //             title={<div className="text-lg font-semibold">{product.product.nameProduct}</div>}
                        //             description={
                        //                 <div>
                        //                     <div className="text-gray-600 mb-2">{product.product.author}</div>
                        //                     <div className="flex items-center mb-2">
                        //                         <Rate
                        //                             disabled
                        //                             defaultValue={product.rating}
                        //                             allowHalf
                        //                             className="text-sm"
                        //                         />
                        //                         <span className="ml-2 text-sm text-gray-500">{product.rating}</span>
                        //                     </div>
                        //                     <div className="flex items-center">
                        //                         <span className="text-red-500 font-semibold text-lg">
                        //                             {product.price}
                        //                         </span>
                        //                         {product.originalPrice && (
                        //                             <span className="ml-2 text-gray-400 text-sm line-through">
                        //                                 {product.originalPrice}
                        //                             </span>
                        //                         )}
                        //                     </div>
                        //                     <div className="text-xs text-gray-500 mt-2">Đã xem: {product.viewedAt}</div>
                        //                 </div>
                        //             }
                        //         />
                        //     </Card>
                        // </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewedProducts;
