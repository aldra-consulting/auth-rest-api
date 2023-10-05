import helmet from 'koa-helmet';

export default helmet.referrerPolicy({ policy: 'same-origin' });
