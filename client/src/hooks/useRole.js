import { useSelector } from 'react-redux';

const useRole = (requiredRoles) => {
    const { user } = useSelector((state) => state.auth);
    return user && requiredRoles.includes(user.role);
};

export default useRole;