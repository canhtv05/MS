package com.leaf.auth.context;

/**
 * ThreadLocal context để lưu trữ channel trong suốt authentication flow
 * Channel sẽ được set từ controller và được lấy ra trong
 * DomainUserDetailsService
 */
public class AuthenticationContext {

  private static final ThreadLocal<String> channelContext = new ThreadLocal<>();

  /**
   * Set channel cho thread hiện tại
   */
  public static void setChannel(String channel) {
    channelContext.set(channel);
  }

  /**
   * Lấy channel từ thread hiện tại
   */
  public static String getChannel() {
    return channelContext.get();
  }

  /**
   * Xóa channel sau khi hoàn thành authentication
   * QUAN TRỌNG: Phải gọi method này để tránh memory leak
   */
  public static void clear() {
    channelContext.remove();
  }
}
