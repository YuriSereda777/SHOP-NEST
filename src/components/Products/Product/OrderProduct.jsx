import PropTypes from "prop-types";
import ProductImage from "./ProductDetails/ProductImage";
import ProductPrice from "./ProductDetails/ProductPrice";
import ProductTitle from "./ProductDetails/ProductTitle";
import ProductQuantity from "./ProductDetails/ProductQuantity";
import WriteReviewButton from "./ProductButtons/WriteReviewButton";

const OrderProduct = ({ product }) => {
  return (
    <div key={product.productId} className="flex flex-row items-start gap-10">
      <div className="flex flex-row gap-5">
        <div className="w-36 aspect-[1/1]">
          <ProductImage
            id={product.productId}
            title={product.productTitle}
            image={product.productImage}
            className="h-36"
          />
        </div>
        <div className="flex flex-col">
          <ProductTitle id={product.productId} title={product.productTitle} />
          <div className="flex flex-row gap-2">
            <span className="text-lg">Price:</span>
            <ProductPrice price={product.productPrice} />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2">
              <span className="text-lg">Amount:</span>
              <ProductQuantity quantity={parseInt(product.productAmount)} />
            </div>
            <WriteReviewButton id={product.productId} />
          </div>
        </div>
      </div>
    </div>
  );
};

OrderProduct.propTypes = {
  product: PropTypes.object.isRequired,
};

export default OrderProduct;
