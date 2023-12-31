import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../api/firebase";
import { FaMapMarkerAlt, FaPhoneAlt, FaAddressBook } from "react-icons/fa";
import { RiShoppingCart2Line } from "react-icons/ri";
import { toast } from "react-toastify";
import useGetFirestoreData from "../hooks/useGetFirestoreData";
import useProductActions from "../hooks/useProductActions";
import Button from "../ui/Button";
import RadioInput from "../ui/RadioInput";
import Loading from "../ui/Loading";
import CheckoutProducts from "../components/Products/CheckoutProducts";

const Checkout = () => {
  const navigate = useNavigate();
  const { emptyCart } = useProductActions();

  const cartTotalQuantity = useSelector((state) => state.cart.totalQuantity);
  const cartTotalPrice = useSelector((state) => state.cart.totalPrice);
  const cartItems = useSelector((state) => state.cart.items);

  const auth = getAuth();
  const userId = auth.currentUser.uid;

  const {
    data: userData,
    isLoading: userDataLoading,
    error: userDataError,
  } = useGetFirestoreData("users", userId);

  const [addressesList, setAddressesList] = useState([]);
  const [activeAddress, setActiveAddress] = useState(0);

  const [phoneNumbersList, setPhoneNumbersList] = useState([]);
  const [activePhoneNumber, setActivePhoneNumber] = useState(0);

  useEffect(() => {
    if (userData) {
      const addressList = [];
      for (const address of userData.addresses) {
        addressList.push({
          value: address,
          label: `${address.apartment} ${address.street}, ${address.city}, ${address.country}, ${address.postalNumber}`,
        });
      }
      setAddressesList(addressList);

      const phoneList = [];
      for (const phoneNumber of userData.phoneNumbers) {
        phoneList.push({
          value: phoneNumber,
          label: phoneNumber,
        });
      }
      setPhoneNumbersList(phoneList);
    }
  }, [userData]);

  useEffect(() => {
    if (userDataError && !userDataLoading) {
      toast.error("An error occurred!");
    }
  }, [userDataError, userDataLoading]);

  if (userDataLoading) {
    return <Loading />;
  }

  const confirmOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (!addressesList[activeAddress]?.value) {
      toast.error("Missing address!");
      return;
    }

    if (!phoneNumbersList[activePhoneNumber]?.value) {
      toast.error("Missing phone number!");
      return;
    }

    try {
      const updatedItems = [];
      for (const item of cartItems) {
        console.log(item);
        updatedItems.push({
          id: item.id,
          price: item.discount
            ? item.price - (item.price * item.discount) / 100
            : item.price,
          amount: item.quantity,
        });
      }

      await addDoc(collection(db, "orders"), {
        userId,
        items: updatedItems,
        address: addressesList[activeAddress].value,
        phoneNumber: phoneNumbersList[activePhoneNumber].value,
        timestamp: serverTimestamp(),
      });

      emptyCart();
      navigate("/profile/orders");
      toast.success("Confirmed your order successfully!");
    } catch (error) {
      const errorMessage = error.message
        ? error.message
            .replace("Firebase: Error (auth/", "")
            .replace(")", "")
            .replace(/-/g, " ")
        : "An error ocurred!";

      const capitalizedError =
        errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);

      toast.error(capitalizedError);
    }
  };

  return (
    <div className="my-12">
      <div className="grid md:grid-flow-col justify-between gap-10 md:gap-20">
        <div className="grow">
          <div className="flex flex-row items-center gap-2 mb-6 text-3xl font-semibold tracking-wide">
            <RiShoppingCart2Line className="text-4xl" />
            Shopping Cart
            <span className="text-xl">({cartTotalQuantity})</span>
          </div>
          <CheckoutProducts products={cartItems} />
        </div>
        <div className="w-80">
          <h2 className="section-heading !mb-4 !text-left">Order Details</h2>
          <div className="mb-4 space-y-2 text-xl">
            <div className="mb-4 pb-4 border-b">
              <RadioInput
                name="address"
                className="mb-5"
                list={addressesList}
                active={activeAddress}
                setActive={setActiveAddress}
              >
                <FaMapMarkerAlt />
              </RadioInput>
              <RadioInput
                name="phoneNumber"
                className="mb-5"
                list={phoneNumbersList}
                active={activePhoneNumber}
                setActive={setActivePhoneNumber}
              >
                <FaPhoneAlt />
              </RadioInput>

              <Link to="/profile/address-book">
                <div className="flex flex-row items-center gap-2 text-orange-600 cursor-pointer transition duration-500 hover:text-orange-700">
                  <FaAddressBook />
                  <span className="text-base font-semibold">
                    Edit your addresses
                  </span>
                </div>
              </Link>
            </div>
            <p>Items: {cartTotalQuantity}</p>
            <p>Total: ${cartTotalPrice}</p>
          </div>
          <Button
            text="Confirm Order"
            className="text-lg !w-full mb-4"
            noBg
            onClick={confirmOrder}
          />
          <Button
            text="Empty Cart"
            className="text-lg !w-full"
            noBg
            onClick={() => emptyCart()}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
