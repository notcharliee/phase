import * as Discord from 'discord.js'
import * as Utils from 'utils'

import axios from 'axios'


export default Utils.Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('github')
    .setDescription('Fetches info about a GitHub repository.')
    .addStringOption(
      new Discord.SlashCommandStringOption()
      .setName('user')
      .setDescription('The repository owner.')
      .setRequired(true)
    )
    .addStringOption(
      new Discord.SlashCommandStringOption()
      .setName('repo')
      .setDescription('The repository name.')
      .setRequired(true)
    ),
  async execute(client, interaction) {
    
    const user = interaction.options.getString('user')
    const repo = interaction.options.getString('repo')

    try {

      await interaction.deferReply()
      
      const githubRepo = await axios.get<GitHubRepository>(`https://api.github.com/repos/${user}/${repo}`)
      const githubRepoData = githubRepo.data
      
      interaction.editReply({
        embeds: [
          new Discord.EmbedBuilder()
          .setAuthor({ name: githubRepoData.owner.login, iconURL: githubRepoData.owner.avatar_url, url: githubRepoData.owner.html_url })
          .setColor(Utils.Enums.PhaseColour.Primary)
          .setDescription(`${githubRepoData.description}\n\n**Language:** ${githubRepoData.language ?? 'None'}\n**Issues:** ${githubRepoData.open_issues}\n**Forks:** ${githubRepoData.forks}\n**Stars:** ${githubRepoData.stargazers_count}\n**License:** ${githubRepoData.license ? githubRepoData.license.name : 'None'}\n**Created:** <t:${Math.floor(new Date(githubRepoData.created_at).getTime() / 1000)}:R>`)
          .setThumbnail(githubRepoData.owner.avatar_url)
          .setTitle(githubRepoData.name)
          .setURL(githubRepoData.html_url)
        ],
      })

    } catch {

      return Utils.Functions.clientError<true>(
        interaction,
        'No can do!',
        `Could not find GitHub repo with name \`${user}/${repo}\`.`,
      )

    }
    
  }
})


type GitHubRepository = {
  id: number
  node_id: string
  name: string
  full_name: string
  private: boolean
  owner: {
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    site_admin: boolean
  }
  html_url: string
  description: string
  fork: boolean
  url: string
  forks_url: string
  keys_url: string
  collaborators_url: string
  teams_url: string
  hooks_url: string
  issue_events_url: string
  events_url: string
  assignees_url: string
  branches_url: string
  tags_url: string
  blobs_url: string
  git_tags_url: string
  git_refs_url: string
  trees_url: string
  statuses_url: string
  languages_url: string
  stargazers_url: string
  contributors_url: string
  subscribers_url: string
  subscription_url: string
  commits_url: string
  git_commits_url: string
  comments_url: string
  issue_comment_url: string
  contents_url: string
  compare_url: string
  merges_url: string
  archive_url: string
  downloads_url: string
  issues_url: string
  pulls_url: string
  milestones_url: string
  notifications_url: string
  labels_url: string
  releases_url: string
  deployments_url: string
  created_at: string
  updated_at: string
  pushed_at: string
  git_url: string
  ssh_url: string
  clone_url: string
  svn_url: string
  homepage: string
  size: number
  stargazers_count: number
  watchers_count: number
  language: string
  has_issues: boolean
  has_projects: boolean
  has_downloads: boolean
  has_wiki: boolean
  has_pages: boolean
  has_discussions: boolean
  forks_count: number
  mirror_url: null | string
  archived: boolean
  disabled: boolean
  open_issues_count: number
  license: {
    key: string
    name: string
    spdx_id: string
    url: null | string
    node_id: string
  }
  allow_forking: boolean
  is_template: boolean
  web_commit_signoff_required: boolean
  topics: string[]
  visibility: string
  forks: number
  open_issues: number
  watchers: number
  default_branch: string
  temp_clone_token: null | string
  network_count: number
  subscribers_count: number
}