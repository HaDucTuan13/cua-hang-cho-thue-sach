import React from 'react';
import { Users, BookOpen } from 'lucide-react';

function Cardbody({ product }) {
    return (
        <div className="w-full max-w-sm bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 group">
            {/* Image Container */}
            <div className="relative overflow-hidden">
                <img
                    src={product.images[0]}
                    alt={product.nameProduct}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col gap-3">
                {/* Author */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">GS</span>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{product.publisher}</span>
                </div>

                {/* Title */}
                <h1 className="text-lg text-gray-900 font-semibold leading-tight line-clamp-2">
                    {product.nameProduct}
                </h1>

                {/* Price */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-red-500">{product.price.toLocaleString()}đ</span>
                        <span className="text-sm text-gray-500">/ ngày</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cardbody;
