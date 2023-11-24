"use client";
import axios from "axios";
import { useState } from "react";

const Upload = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: [],
  });

  const handleChange = (e: any) => {
    if (e.target.name === "image") {
      const files = Array.from(e.target.files);
      setProduct({ ...product, [e.target.name]: files });
    } else {
      setProduct({ ...product, [e.target.name]: e.target.value });
    }
  };
  const onsubmit = async (e: any) => {
    e.preventDefault();

    const data = new FormData();
    product.image.forEach((file, index) => {
      data.append(`images`, file);
    });

    data.append("name", product.name);
    data.append("description", product.description);
    data.append("price", product.price);

    try {
      await axios.post("/api/upload", data);
      setProduct({ name: "", price: "", description: "", image: [] });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-screen flex justify-center items-center bg-gray-400">
      <form onSubmit={onsubmit}>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={product.name}
            placeholder="Product Name"
          />
          <input
            type="text"
            name="price"
            onChange={handleChange}
            value={product.price}
            placeholder="Product Price"
          />
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
          ></textarea>
          <input type="file" multiple name="image" onChange={handleChange} />
          <input
            type="submit"
            value="Submit"
            className="p-3 bg-black text-white rounded-md hover:cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
};

export default Upload;
