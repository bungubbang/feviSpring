package com.fevi.app.filter;

import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by bungubbang
 * Email: sungyong.jung@sk.com
 * Date: 3/12/14
 */
public class SupportBrowserFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
        String userAgent = request.getHeader("User-Agent");
        if(userAgent.contains("NAVER") || userAgent.contains("DaumApps") || userAgent.contains("MSIE")) {
            httpServletResponse.sendRedirect("/not_support");
        }
        filterChain.doFilter(request, httpServletResponse);
    }
}
