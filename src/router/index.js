import { route } from 'quasar/wrappers'
import routes from "./routes";
import {createRouting} from "module-frontend-base";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store } */) {
  return createRouting(routes);
})
