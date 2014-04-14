package com.fevi.app.repository;

import com.fevi.app.domain.Card;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

/**
 * Created by bungubbang
 * Email: sungyong.jung@sk.com
 * Date: 3/9/14
 */
public interface CardRepository extends MongoRepository<Card, String> {
    public Card findById(String id);
    public Page<Card> findByCategory(String category, Pageable pageable);
    public List<Card> findByDescriptionContaining(String description, Sort sort);

    @Query("{id: { $in : ?0 } }")
    public List<Card> findByListId(List<String> keyword);

    @Query("{created_time: {$gt: ?0 }, category: ?1 }")
    public Page<Card> findWeekly(String start, String menu, Pageable pageable);
}
