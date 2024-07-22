import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import './ProductList.css';

const ProductList = () => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [searchTitle, setSearchTitle] = useState('');
    const [searchPrice, setSearchPrice] = useState('');
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/products');
            setProducts(response.data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching products:', err);
        }
    };

    const handleSearchTitleChange = useCallback((e) => {
        setSearchTitle(e.target.value.toLowerCase());
    }, []);

    const handleSearchPriceChange = useCallback((e) => {
        setSearchPrice(e.target.value);
    }, []);

    const handleAddToCart = (product) => {
        dispatch(addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
        }));
    };

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesTitle = product.title.toLowerCase().includes(searchTitle);
            const matchesPrice = searchPrice === '' || product.price <= parseFloat(searchPrice);
            return matchesTitle && matchesPrice;
        });
    }, [products, searchTitle, searchPrice]);

    useEffect(() => {
        fetchProducts();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="product-list">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for products by title..."
                    value={searchTitle}
                    onChange={handleSearchTitleChange}
                />
                <input
                    type="number"
                    placeholder="Search for products by price..."
                    value={searchPrice}
                    onChange={handleSearchPriceChange}
                />
            </div>
            {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                    <div key={product.id} className="product-card">
                        <img src={product.image} alt={product.title} className="product-image" />
                        <div className="product-info">
                            <h3 className="product-title">{product.title}</h3>
                            <p className="product-description">{product.description}</p>
                            <p className="product-price">${product.price}</p>
                            <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No products found</p>
            )}
        </div>
    );
};

export default ProductList;
