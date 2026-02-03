import {
  index,
  prefix,
  route,
  type RouteConfig,
} from '@react-router/dev/routes';

export default [
  // Root routes
  index('./routes/home.tsx'),
  route('info', './routes/info.tsx'),
  route('login', './routes/login.tsx'),
  route('logout', './routes/logout.tsx'),

  // Dashboard routes
  route('dashboard', './routes/dashboard/layout.tsx', [
    index('./routes/dashboard/index.tsx'),
    route('add', './routes/dashboard/add.tsx'),
    //route('ai', './routes/dashboard/ai.tsx'),
    route('todolist', './routes/dashboard/todolist.tsx'),
  ]),

  // API routes
  ...prefix('api', [
    route('ai', './routes/api/ai.tsx'),
    route('share', './routes/api/share.tsx'),
    route('todolist', './routes/api/todolist.tsx'),
    route('todo', './routes/api/todo/index.tsx'),
    route('todo/finish', './routes/api/todo/finish.tsx'),
  ]),

  // Auth routes
  ...prefix('auth', [
    route(':providor', './routes/auth/$providor/index.tsx'),
    route(':providor/callback', './routes/auth/$providor/callback/index.tsx'),
    route('failure', './routes/auth/failure.tsx'),
    route('logout', './routes/auth/logout.tsx'),
  ]),

  // Share routes
  route('share/:id', './routes/share/$id/index.tsx'),
] satisfies RouteConfig;
