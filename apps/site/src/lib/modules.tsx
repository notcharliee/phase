import { env } from "@/lib/env"

export default [
  {
    name: "Audit Logs",
    description: "Provides a detailed log of all server activities and events to the channel of your choice.",
    docs_url: `${env.NEXT_PUBLIC_BASE_URL}/docs/modules/audit-logs`,
    docs_jsx: (
      <div className="space-y-4 leading-7">
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam incidunt optio rem quasi quibusdam. Esse dolorem id ipsa natus dignissimos officia, rem ea repellendus sit dolores ad nam possimus deserunt!
        </p>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam incidunt optio rem quasi quibusdam. Esse dolorem id ipsa natus dignissimos officia, rem ea repellendus sit dolores ad nam possimus deserunt!
        </p>
      </div>
    ),
  },
  {
    name: "Auto Partners",
    description: "Lets you partner with other servers that use Phase through the dashboard.",
    docs_url: `${env.NEXT_PUBLIC_BASE_URL}/docs/modules/auto-partners`,
    docs_jsx: (
      <div className="space-y-4 leading-7">
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam incidunt optio rem quasi quibusdam. Esse dolorem id ipsa natus dignissimos officia, rem ea repellendus sit dolores ad nam possimus deserunt!
        </p>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam incidunt optio rem quasi quibusdam. Esse dolorem id ipsa natus dignissimos officia, rem ea repellendus sit dolores ad nam possimus deserunt!
        </p>
      </div>
    ),
  },
  {
    name: "Auto Roles",
    description: "Automatically assigns roles to new members of your server as soon as they join.",
    docs_url: `${env.NEXT_PUBLIC_BASE_URL}/docs/modules/auto-roles`,
    docs_jsx: (
      <div className="space-y-4 leading-7">
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam incidunt optio rem quasi quibusdam. Esse dolorem id ipsa natus dignissimos officia, rem ea repellendus sit dolores ad nam possimus deserunt!
        </p>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam incidunt optio rem quasi quibusdam. Esse dolorem id ipsa natus dignissimos officia, rem ea repellendus sit dolores ad nam possimus deserunt!
        </p>
      </div>
    ),
  },
  {
    name: "Join to Create",
    description: "Dynamically creates a new, temporary voice channel and deletes it when all members leave.",
    docs_url: `${env.NEXT_PUBLIC_BASE_URL}/docs/modules/join-to-create`,
    docs_jsx: (
      <div className="space-y-4 leading-7">
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam incidunt optio rem quasi quibusdam. Esse dolorem id ipsa natus dignissimos officia, rem ea repellendus sit dolores ad nam possimus deserunt!
        </p>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam incidunt optio rem quasi quibusdam. Esse dolorem id ipsa natus dignissimos officia, rem ea repellendus sit dolores ad nam possimus deserunt!
        </p>
      </div>
    ),
  },
  {
    name: "Levels",
    description: "Ranks members by how much they send messages in a server.",
    docs_url: `${env.NEXT_PUBLIC_BASE_URL}/docs/modules/levels`,
    docs_jsx: (
      <div className="space-y-4 leading-7">
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam incidunt optio rem quasi quibusdam. Esse dolorem id ipsa natus dignissimos officia, rem ea repellendus sit dolores ad nam possimus deserunt!
        </p>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam incidunt optio rem quasi quibusdam. Esse dolorem id ipsa natus dignissimos officia, rem ea repellendus sit dolores ad nam possimus deserunt!
        </p>
      </div>
    ),
  },
  {
    name: "Reaction Roles",
    description: "Lets members self assign specific roles through reacting to a message.",
    docs_url: `${env.NEXT_PUBLIC_BASE_URL}/docs/modules/reaction-roles`,
    docs_jsx: (
      <div className="space-y-4 leading-7">
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam incidunt optio rem quasi quibusdam. Esse dolorem id ipsa natus dignissimos officia, rem ea repellendus sit dolores ad nam possimus deserunt!
        </p>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam incidunt optio rem quasi quibusdam. Esse dolorem id ipsa natus dignissimos officia, rem ea repellendus sit dolores ad nam possimus deserunt!
        </p>
      </div>
    ),
  },
  {
    name: "Tickets",
    description: "Lets members create private tickets for easily contacting server staff.",
    docs_url: `${env.NEXT_PUBLIC_BASE_URL}/docs/modules/tickets`,
    docs_jsx: (
      <div className="space-y-4 leading-7">
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam incidunt optio rem quasi quibusdam. Esse dolorem id ipsa natus dignissimos officia, rem ea repellendus sit dolores ad nam possimus deserunt!
        </p>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam incidunt optio rem quasi quibusdam. Esse dolorem id ipsa natus dignissimos officia, rem ea repellendus sit dolores ad nam possimus deserunt!
        </p>
      </div>
    ),
  },
] satisfies {
  name: string,
  description: string,
  docs_url: `${string}/docs/modules/${string}`,
  docs_jsx: JSX.Element,
}[]
