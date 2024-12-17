import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setReservationList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const ReservationList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user._id);
  const reservationList = useSelector((state) => state.user.reservationList);

  const dispatch = useDispatch();

  const getReservationList = async () => {
    try {
      const response = await fetch(
        https://dream-nest-backend-s8v7.onrender.com/users/${userId}/reservations`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      console.log("Fetched Reservation List:", data); // Log the fetched data for debugging
      dispatch(setReservationList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Reservation List failed!", err.message);
      setLoading(false); // Stop loading even in case of error
    }
  };

  useEffect(() => {
    getReservationList();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Reservation List</h1>
      <div className="list">
        {reservationList && reservationList.length > 0 ? (
          reservationList.map((reservation, index) => {
            const {
              listingId = {}, // Fallback to empty object if undefined
              hostId = {}, // Fallback to empty object if undefined
              startDate = "N/A",
              endDate = "N/A",
              totalPrice = 0,
              booking = true,
            } = reservation || {}; // Handle case where reservation might be null/undefined

            return (
              <ListingCard
                key={index} // Add a unique key for each card
                listingId={listingId?._id || "Unknown"} // Ensure listingId is safely accessed
                creator={hostId?._id || "Unknown"} // Ensure hostId is safely accessed
                listingPhotoPaths={listingId?.listingPhotoPaths || []} // Ensure fallback for photo paths
                city={listingId?.city || "Unknown"} // Fallback city
                province={listingId?.province || "Unknown"} // Fallback province
                country={listingId?.country || "Unknown"} // Fallback country
                category={listingId?.category || "Unknown"} // Fallback category
                startDate={startDate}
                endDate={endDate}
                totalPrice={totalPrice}
                booking={booking}
              />
            );
          })
        ) : (
          <p>No reservations found.</p> // Display message when no reservations exist
        )}
      </div>
      <Footer />
    </>
  );
};

export default ReservationList;
