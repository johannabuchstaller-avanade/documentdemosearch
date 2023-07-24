import { createContext, useContext } from 'react';

const UserContext = useContext(createContext<any>(null));

export default UserContext;