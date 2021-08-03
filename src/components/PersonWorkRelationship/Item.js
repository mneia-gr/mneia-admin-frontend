import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Returns a Person-Work Relationship as a list item or as a table row.
 * @param {object} personWorkRelationship
 * @param {string} scope - either 'person' or 'work'
 * @param {string} as - either 'li' or 'tr'
 * @returns 
 */
const PersonWorkRelationshipItem = ({ personWorkRelationship, scope, as }) => {
  const [person, setPerson] = useState();
  const [work, setWork] = useState();
  const [type, setType] = useState();

  useEffect(
    () => {
      if (scope === "person") {
        axios
          .get(`http://backend.mneia.gr/api/people/${personWorkRelationship.person}/`)
          .then((response) => {
            setPerson(response.data)
          })
      }
    },
    [personWorkRelationship, scope]
  )

  useEffect(
    () => {
      if (scope === "work") {
        axios
          .get(`http://backend.mneia.gr/api/works/${personWorkRelationship.work}/`)
          .then((response) => {
            setWork(response.data)
          })
      }
    },
    [personWorkRelationship, scope]
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

  if (scope === "person" && as === "li") {
    return (
      <li>
        <Link to={`/people/${personWorkRelationship.person}`}>{person && person.name}</Link>
        {' '}
        {type && `(${type.name})`}
        {personWorkRelationship.note && <><br /><span className="text-muted">{personWorkRelationship.note}</span></>}
      </li>
    );
  } else if (scope === "work" && as === "tr") {
    return (
      <tr>
        <td>
          <Link to={`/works/${personWorkRelationship.work}`}>{work && work.name}</Link>
        </td>
        <td>{type && type.name}</td>
        <td>{personWorkRelationship.note}</td>
      </tr>
    )
  }
}

export default PersonWorkRelationshipItem;