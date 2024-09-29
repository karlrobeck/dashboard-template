import { useLocation } from "@solidjs/router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Show } from "solid-js";

const BreadcrumbURL = () => {
  const route = useLocation();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {route.pathname
          .split("/")
          .filter((val) => val !== "")
          .map((val, index, arr) => {
            const upperCaseLink = val.at(0)?.toUpperCase() + val.slice(1);
            return (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    current={index === arr.length - 1}
                    class="cursor-pointer"
                  >
                    {upperCaseLink}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <Show when={index !== arr.length - 1}>
                  <BreadcrumbSeparator />
                </Show>
              </>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbURL;
