import { UserService, AdminService, AuthService } from '@app'

/**
 * A Singleton class that provides access to various services.
 * This class ensures that only one instance of each service is created and provides
 * a way to access that instance.
 */
class Singleton {
  private static userInstance: UserService
  private static adminInstance: AdminService
  private static authInstance: AuthService

  /**
   * Returns the singleton instance of the UserService class. If the instance does not exist,
   * it creates a new one.
   * @returns {UserService} - The singleton instance of the UserService class.
   */
  public static getUserInstance(): UserService {
    if (!Singleton.userInstance) {
      Singleton.userInstance = new UserService()
    }
    return Singleton.userInstance
  }

  /**
   * Returns the singleton instance of the AdminService class. If the instance does not exist,
   * it creates a new one.
   * @returns {AdminService} - The singleton instance of the AdminService class.
   */
  public static getAdminInstance(): AdminService {
    if (!Singleton.adminInstance) {
      Singleton.adminInstance = new AdminService()
    }
    return Singleton.adminInstance
  }

  /**
   * Returns the singleton instance of the AuthService class. If the instance does not exist,
   * it creates a new one.
   * @returns {AuthService} - The singleton instance of the AuthService class.
   */
  public static getAuthInstance(): AuthService {
    if (!Singleton.authInstance) {
      Singleton.authInstance = new AuthService()
    }
    return Singleton.authInstance
  }
}

export { Singleton }
