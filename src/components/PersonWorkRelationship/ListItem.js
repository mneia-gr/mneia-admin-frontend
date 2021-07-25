import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const PersonWorkRelationshipListItem = ({ personWorkRelationship }) => {
  const [person, setPerson] = useState();
  const [type, setType] = useState();

  useEffect(
    () => {
      axios
        .get(`http://backend.mneia.gr/api/people/${personWorkRelationship.person}/`)
        .then((response) => {
          setPerson(response.data)
        })
    },
    [personWorkRelationship]
  )

  useEffect(
    () => {
      axios
        .get(`http://backend.mneia.gr/api/person-work-relationship-types/${personWorkRelationship.type}/`)
        .then((response) => {
          setType(response.data)
        })
    },
    [personWorkRelationship]
  )

  return (
    <li>
      <Link to={`/people/${personWorkRelationship.person}`}>{person && person.name}</Link>
      {' '}
      {type && `(${type.name})`}
      {personWorkRelationship.note && <><br /><span className="text-muted">{personWorkRelationship.note}</span></>}
    </li>
  );
}
 
export default PersonWorkRelationshipListItem;