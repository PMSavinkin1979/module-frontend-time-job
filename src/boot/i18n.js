import { boot } from 'quasar/wrappers'
import {createLocalization} from "module-frontend-base";
import messages from 'src/i18n'

const i18n = createLocalization(messages);

export default boot(({ app }) => {
  app.use(i18n)
})

export { i18n };
