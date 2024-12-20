    import React, { useState } from "react";
import axiosInstance from "../../../api/Axios";

    const Variant = ({ variantAttributes, productId }) => {
    const [attributes, setAttributes] = useState({});
    const [quantity, setQuantity] = useState("");
    const [salePrice, setSalePrice] = useState("");
    const [regularPrice, setRegularPrice] = useState("");
    //const [productId, setProductId] = useState(productId);

    const handleInputChange = (attribute, value) => {
        setAttributes((prevAttributes) => ({
        ...prevAttributes,
        [attribute]: value,
        }));
    };

    const handleSubmit = async()=>{
        try {
            const response = await axiosInstance.post('/admin/addvariant',{attributes,quantity,regularPrice,salePrice,productId});
            if(response.status === 201){
                alert(response.message,'successs')
                Navigate('/admin/products')
            }
        } catch (error) {
            console.log('variant adding ',error)
        }

    }

    return (
        <div>
        <form onSubmit={handleSubmit} >
            {variantAttributes.map((attribute) => (
            <div key={attribute}>
                <label htmlFor={attribute}>{attribute}:</label>
                <input
                type="text"
                id={attribute}
                name={attribute}
                onChange={(e) => handleInputChange(attribute, e.target.value)}
                />
            </div>
            ))}

            <label>Quantity:</label>
            <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            />

            <label>Regular Price:</label>
            <input
            type="number"
            value={regularPrice}
            onChange={(e) => setRegularPrice(e.target.value)}
            />

            <label>Sale Price:</label>
            <input
            type="number"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            />

            {/* <input
            type="hidden"
            name="productId"
            value={productId|| ""}
            onChange={(e) => setProductId(e.target.value)}
            /> */}

            <button type="submit">Submit</button>
        </form>
        </div>
    );
    };

    export default Variant;
