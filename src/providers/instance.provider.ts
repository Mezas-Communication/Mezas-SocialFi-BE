import {
  UserService,
  AdminService,
  AuthService,
  TransactionService,
  NftService,
  MetadataService
} from '@app'

/**
 * A Singleton class that provides access to various services.
 * This class ensures that only one instance of each service is created and provides
 * a way to access that instance.
 */
class Singleton {
  private static userInstance: UserService
  private static adminInstance: AdminService
  private static authInstance: AuthService
  private static transactionInstance: TransactionService
  private static nftInstance: NftService
  private static metadataService: MetadataService

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

  /**
   * Returns the singleton instance of the TransactionService class. If the instance does not exist,
   * it creates a new one.
   * @returns {TransactionService} - The singleton instance of the TransactionService class.
   */
  public static getTransactionInstance(): TransactionService {
    if (!Singleton.transactionInstance) {
      Singleton.transactionInstance = new TransactionService()
    }
    return Singleton.transactionInstance
  }

  /**
   * Returns the singleton instance of the NftService class. If the instance does not exist,
   * it creates a new one.
   * @returns {NftService} - The singleton instance of the NftService class.
   */
  public static getNftInstance(): NftService {
    if (!Singleton.nftInstance) {
      Singleton.nftInstance = new NftService()
    }
    return Singleton.nftInstance
  }

  /**
   * Returns the singleton instance of the MetadataService class. If the instance does not exist,
   * it creates a new one.
   * @returns {MetadataService} - The singleton instance of the MetadataService class.
   */
  public static getMetadataInstance(): MetadataService {
    if (!Singleton.metadataService) {
      Singleton.metadataService = new MetadataService()
    }
    return Singleton.metadataService
  }
}

export { Singleton }
