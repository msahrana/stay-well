import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import {useQuery} from "@tanstack/react-query";

const useRole = () => {
  const {user, loading} = useAuth();
  const axiosSecure = useAxiosSecure();

  const {data: role = "", isPending} = useQuery({
    queryKey: ["role", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const {data} = await axiosSecure.get(`/user/${user?.email}`);
      return data.role;
    },
  });

  return [role, isPending];
};

export default useRole;
