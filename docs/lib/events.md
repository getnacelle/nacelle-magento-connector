# Events

| Event | Description |
| ------- | -------|
| `app:init` | Initialize the App |
| `app:configure` | Configure the App |
| `router:init` | Router load sequence initiated |
| `router:loaded:route` | Route loaded into App |
| `router:ready` | All Routes loaded Router is Ready |
| `router:error` | There was an Error in the Router loading sequence |
| `job-manager:ready` | Job manager ready to receive Jobs |
| `job-manager:status` | Job manager status update |
| `job-manager:error` | Job manager experienced an error in a Job |
| `job:runner:start` | Job runner started |
| `job:runner:status` | Job runner status update |
| `job:runner:done` | Job runner, all Jobs done |
| `job:runner:error` | Job runner encountered an Error running a Job |
| `job:start` | Job worker started |
| `job:status` | Job status update |
| `job:complete` | Job worker complete |
| `job:error` | Job worker encountered an Error |
