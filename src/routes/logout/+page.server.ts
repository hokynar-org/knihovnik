import { redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
    
}

export const actions: Actions = {
  logout: async ({cookies }) => {
    cookies.set('session', '', {
      path: '/',
      expires: new Date(0),
    })

    throw redirect(302, '/')
  },
}
