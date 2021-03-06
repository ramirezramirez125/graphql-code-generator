import gql from 'graphql-tag';
import 'stencil-apollo';
import { Component, Prop, h } from '@stencil/core';

declare global {
  export type CommentQueryVariables = {
    repoFullName: Types.Scalars['String'];
    limit?: Types.Maybe<Types.Scalars['Int']>;
    offset?: Types.Maybe<Types.Scalars['Int']>;
  };

  export type CommentQuery = { __typename?: 'Query' } & {
    currentUser: Types.Maybe<{ __typename?: 'User' } & Pick<Types.User, 'login' | 'html_url'>>;
    entry: Types.Maybe<
      { __typename?: 'Entry' } & Pick<Types.Entry, 'id' | 'createdAt' | 'commentCount'> & {
          postedBy: { __typename?: 'User' } & Pick<Types.User, 'login' | 'html_url'>;
          comments: Array<Types.Maybe<{ __typename?: 'Comment' } & CommentsPageCommentFragment>>;
          repository: { __typename?: 'Repository' } & Pick<Types.Repository, 'description' | 'open_issues_count' | 'stargazers_count' | 'full_name' | 'html_url'>;
        }
    >;
  };
}

const CommentDocument = gql`
  query Comment($repoFullName: String!, $limit: Int, $offset: Int) {
    currentUser {
      login
      html_url
    }
    entry(repoFullName: $repoFullName) {
      id
      postedBy {
        login
        html_url
      }
      createdAt
      comments(limit: $limit, offset: $offset) {
        ...CommentsPageComment
      }
      commentCount
      repository {
        full_name
        html_url
        ... on Repository {
          description
          open_issues_count
          stargazers_count
        }
      }
    }
  }
  ${CommentsPageCommentFragmentDoc}
`;

@Component({
  tag: 'apollo-comment',
})
export class CommentComponent {
  @Prop() renderer: import('stencil-apollo').QueryRenderer<CommentQuery, CommentQueryVariables>;
  @Prop() variables: CommentQueryVariables;
  render() {
    return <apollo-query query={CommentDocument} variables={this.variables} renderer={this.renderer} />;
  }
}
