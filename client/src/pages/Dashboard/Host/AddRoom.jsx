import {useState} from "react";
import {useNavigate} from "react-router-dom";
import AddRoomForm from "../../../components/Form/AddRoomForm";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import {Helmet} from "react-helmet-async";
import {imageUpload} from "../../../api/utils";
import {useMutation} from "@tanstack/react-query";

const AddRoom = () => {
  const {user} = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState();
  const [imageText, setImageText] = useState("Upload Image");
  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const handleDates = (item) => {
    console.log(item);
    setDates(item.selection);
  };

  const {mutateAsync} = useMutation({
    mutationFn: async (roomData) => {
      const {data} = await axiosSecure.post(`/room`, roomData);
      return data;
    },
    onSuccess: () => {
      toast.success("Your Room Added Successfully!");
      navigate("/dashboard/my-listings");
      setLoading(false);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const location = form.location.value;
    const category = form.category.value;
    const title = form.title.value;
    const to = dates.endDate;
    const from = dates.startDate;
    const price = form.price.value;
    const guests = form.total_guest.value;
    const bathrooms = form.bathrooms.value;
    const description = form.description.value;
    const bedrooms = form.bedrooms.value;
    const image = form.image.files[0];
    const host = {
      name: user?.displayName,
      image: user?.photoURL,
      email: user?.email,
    };
    try {
      const image_url = await imageUpload(image);
      const roomData = {
        location,
        title,
        category,
        to,
        from,
        price,
        guests,
        bathrooms,
        bedrooms,
        description,
        host,
        image: image_url,
      };
      await mutateAsync(roomData);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      setLoading(false);
    }
  };

  const handleImage = (image) => {
    setImagePreview(URL.createObjectURL(image));
    setImageText(image.name);
  };

  return (
    <>
      <Helmet>
        <title>Add Room | Dashboard</title>
      </Helmet>
      {/* form */}
      <AddRoomForm
        dates={dates}
        handleDates={handleDates}
        handleSubmit={handleSubmit}
        imagePreview={imagePreview}
        handleImage={handleImage}
        imageText={imageText}
        loading={loading}
      />
    </>
  );
};

export default AddRoom;
