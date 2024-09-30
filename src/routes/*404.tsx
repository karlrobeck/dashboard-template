import { HttpStatusCode } from "@solidjs/start";
const NotFoundPage = () => {
  return (
    <>
      <HttpStatusCode code={404} />
      <div>Page not found</div>
    </>
  );
};

export default NotFoundPage;
