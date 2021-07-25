import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const PersonListItem = ({ id }) => {
  const [person, setPerson] = useState();

  useEffect(
    () => {
      axios
        .get(`http://backend.mneia.gr/api/people/${id}/`)
        .then((response) => {
          setPerson(response.data)
        })
    },
    [id]
  )

  return (
    <li key={id}>
      <Link to={`/people/${id}`}>{person && person.name}</Link>
    </li>
   );
}

export default PersonListItem;
