import { Component, Vue } from 'nuxt-property-decorator';
import { Team } from '~/types/team';

@Component
export class UserMixin extends Vue {
  get isLoggedIn(): Boolean {
    return this.$auth.loggedIn;
  }

  get currentUser() {
    return this.$auth.user.data;
  }

  get leadsTeams() {
    return this.isAdmin || this.$auth.user.data.teams.some((team: Team) => team.is_leader);
  }

  get userId() {
    return this.$auth.user.data.id;
  }

  get userName() {
    return this.$auth.user.data.name;
  }

  get isAdmin(): boolean {
    return this.$auth.user.data.is_admin;
  }

  get isGuest(): boolean {
    return this.$auth.user.data.is_guest;
  }
}
