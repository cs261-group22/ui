/* eslint-disable camelcase */
import { Component, Vue } from 'nuxt-property-decorator';
import { Team } from '~/types/models/team';
import { User } from '~/types/models/user';

@Component
export class UserMixin extends Vue {
  get isLoggedIn(): Boolean {
    return this.$auth.loggedIn;
  }

  get currentUser(): User | undefined {
    return this.$auth.user.data;
  }

  get leadsTeams(): boolean {
    return this.isAdmin || this.$auth.user?.data?.teams.some((team: Team) => team.is_leader);
  }

  get userId(): number | undefined {
    return this.$auth.user?.data?.id;
  }

  get userName(): string | undefined {
    return this.$auth.user?.data?.name;
  }

  get isAdmin(): boolean | undefined {
    return this.$auth.user?.data?.is_admin;
  }

  get isGuest(): boolean | undefined {
    return this.$auth.user?.data?.is_guest;
  }
}
