import { useState, useEffect, useRef } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const effectRan = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController(); // to cancel request

    if (effectRan.current === true) {
      const getUsers = async () => {
        try {
          const response = await axiosPrivate.get('/users', {
            signal: controller.signal,
          });
          console.log(response.data);
          isMounted && setUsers(response.data);
        } catch (err) {
          console.error(err);
          navigate('/login', { state: { from: location }, replace: true });
        }
      };

      getUsers();
    }
    return () => {
      isMounted = false;
      controller.abort();
      effectRan.current = true;
    };
  }, []);

  return (
    <article>
      <h2>Users List</h2>
      {users?.length ? (
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user?.username}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
    </article>
  );
};

export default Users;
