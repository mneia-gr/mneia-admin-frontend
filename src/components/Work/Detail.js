import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import useFetch from "../../useFetch";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const WorkDetail = () => {
  const { id } = useParams();
  const { data: work, isPending, error } = useFetch('http://localhost:8000/api/works/' + id + '/')

  return (
    <div>
      {isPending && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {work && (
        <>
          <article>
            <h2>{work.name}</h2>
            <ReactMarkdown rehypePlugins={[rehypeRaw]} children={work.content} />
          </article>
          <Helmet>
            <title>{ work.name }</title>
          </Helmet>
        </>
      )}
    </div>
  );
}

export default WorkDetail;