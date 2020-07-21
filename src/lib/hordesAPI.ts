import fetch from "node-fetch";
import { APIBase, HordesAPI, Field } from "./hordes-api";
import { stringify } from "query-string";

const BASE_URL = "http://www.hordes.fr/tid/graph";

const createApi = <ApiDef extends APIBase>() => {
  const getUrl = (path: string, token: string) => `${BASE_URL}${path}?access_token=${token}`;
  const mapFields = (fields?: Field<any>[]) => {
    return fields
      ?.map((field) => {
        if (typeof field === "string") {
          return field;
        } else {
          const entries = Object.entries(field);

          return entries.map(([key, values]) => `${key}.fields(${mapFields(values)})`).join(",");
        }
      })
      .filter((field: string) => field);
  };

  const callApi = async <T extends keyof ApiDef>(
    path: T,
    token: string,
    params: ApiDef[T]["params"] = {}
  ): Promise<ApiDef[T]["response"]> => {
    const url = getUrl(path as string, token);
    const { fields, ...rest } = params;
    const query = stringify({ ...rest, fields: mapFields(fields) }, { arrayFormat: "comma" });
    const response = await fetch(`${url}&${query}`);

    if (!response.ok) {
      return Promise.reject(response.json());
    }

    return await response.json();
  };
  return {
    request: callApi,
  };
};

const api = createApi<HordesAPI>();

export default {
  async status(token: string) {
    return api.request("/status", token, {});
  },
  async info(token: string, params?: HordesAPI["/me"]["params"]) {
    return api.request("/me", token, params);
  },
  async player(token: string, params: HordesAPI["/user"]["params"]) {
    console.log("player", { token, params });
    return api.request("/user", token, params);
  },
};
