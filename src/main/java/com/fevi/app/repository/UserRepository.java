package com.fevi.app.repository;

import com.fevi.app.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Created by bungubbang
 * Email: sungyong.jung@sk.com
 * Date: 3/12/14
 */
public interface UserRepository extends MongoRepository<User, String> {
    public User findByUid(String uid);
}
